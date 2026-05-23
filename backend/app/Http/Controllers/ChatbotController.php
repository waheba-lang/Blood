<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    public function handle(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'lang' => 'nullable|string|in:fr,ar,en',
        ]);

        $message = trim($validated['message']);
        $normalizedMessage = mb_strtolower($message);
        $lang = $validated['lang'] ?? 'fr';

        if (! $this->isInScope($normalizedMessage)) {
            return response()->json(['response' => $this->getOutOfScopeResponse($lang)]);
        }

        $ruleBasedResponse = $this->getRuleBasedResponse($normalizedMessage, $lang);
        $apiKey = env('GEMINI_API_KEY');

        if ($ruleBasedResponse || ! $apiKey) {
            return response()->json([
                'response' => $ruleBasedResponse ?: $this->getDefaultFallback($lang),
            ]);
        }

        try {
            $response = Http::timeout(20)->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $this->buildScopedPrompt($message, $lang)],
                        ],
                    ],
                ],
                'generationConfig' => [
                    'temperature' => 0.4,
                    'topK' => 20,
                    'topP' => 0.8,
                    'maxOutputTokens' => 220,
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = trim($data['candidates'][0]['content']['parts'][0]['text'] ?? '');

                return response()->json([
                    'response' => $reply !== '' ? $reply : $this->getDefaultFallback($lang),
                ]);
            }

            Log::error('Gemini API Error: ' . $response->body());
            return response()->json(['response' => $this->getDefaultFallback($lang)]);
        } catch (\Exception $e) {
            Log::error('Chatbot Exception: ' . $e->getMessage());
            return response()->json(['response' => $this->getDefaultFallback($lang)]);
        }
    }

    private function isInScope(string $message): bool
    {
        $scopeKeywords = [
            'blood', 'donation', 'donor', 'donate', 'plasma', 'platelets', 'eligib', 'eligible',
            'transfusion', 'blood type', 'group', 'hemoglobin', 'tattoo', 'vaccine', 'pregnan',
            'don du sang', 'donner', 'donneur', 'sang', 'transfusion', 'groupe sanguin',
            'eligibil', 'condition', 'centre', 'crts', 'oujda', 'morocco', 'maroc', 'hopital',
            'hôpital', 'al farabi', 'avenue errazi', 'وجدة', 'التبرع', 'الدم', 'متبرع', 'فصيلة',
            'مركز', 'نقل الدم', 'شروط', 'مؤهل', 'الهيموغلوبين', 'المستشفى',
        ];

        foreach ($scopeKeywords as $keyword) {
            if (str_contains($message, $keyword)) {
                return true;
            }
        }

        return false;
    }

    private function getRuleBasedResponse(string $message, string $lang): ?string
    {
        $knowledge = [
            'fr' => [
                [
                    'keywords' => ['bonjour', 'salut', 'bonsoir'],
                    'response' => "Bonjour ! Je peux vous aider sur le don de sang, les conditions de don, le déroulement du don et les centres de don à Oujda.",
                ],
                [
                    'keywords' => ['oujda', 'centre', 'adresse', 'où donner', 'lieu'],
                    'response' => "À Oujda, le principal lieu de don est le Centre Régional de Transfusion Sanguine d'Oujda, Avenue Errazi, Oujda 60000. Il est conseillé d'appeler ou de vérifier sur place les horaires avant de vous déplacer.",
                ],
                [
                    'keywords' => ['éligible', 'eligible', 'condition', 'âge', 'poids', 'santé', 'conditions'],
                    'response' => "En général, vous pouvez donner votre sang si vous avez entre 18 et 60 ans, pesez au moins 50 kg, êtes en bonne santé et présentez une pièce d'identité. Un entretien médical sur place confirme toujours l'éligibilité finale.",
                ],
                [
                    'keywords' => ['fréquence', 'combien de fois', 'intervalle', 'quand redonner'],
                    'response' => "En général, il faut respecter environ 8 à 12 semaines entre deux dons de sang total. Si vous avez déjà donné récemment, attendez la période recommandée par l'équipe médicale.",
                ],
                [
                    'keywords' => ['processus', 'déroulement', 'comment se passe', 'étapes'],
                    'response' => "Le don se déroule en quelques étapes : accueil, questionnaire médical, petit contrôle de santé, prélèvement, puis repos avec collation. La collecte elle-même dure souvent autour de 10 minutes.",
                ],
                [
                    'keywords' => ['avantage', 'bénéfice', 'pourquoi donner'],
                    'response' => "Le don de sang peut sauver plusieurs vies. C'est aussi une action solidaire, rapide, et vous bénéficiez généralement d'un petit contrôle avant le prélèvement.",
                ],
                [
                    'keywords' => ['risque', 'danger', 'douleur', 'peur'],
                    'response' => "Le don de sang est généralement sûr. Le matériel est stérile et à usage unique. Vous pouvez ressentir une petite piqûre et parfois une légère fatigue après le don, d'où l'importance de bien s'hydrater et se reposer.",
                ],
            ],
            'ar' => [
                [
                    'keywords' => ['مرحبا', 'السلام', 'أهلا'],
                    'response' => "مرحبا! يمكنني مساعدتك في أسئلة التبرع بالدم، شروط التبرع، خطوات العملية، ومراكز التبرع في وجدة.",
                ],
                [
                    'keywords' => ['وجدة', 'مركز', 'عنوان', 'أين', 'مكان'],
                    'response' => "في وجدة، المكان الرئيسي للتبرع هو المركز الجهوي لتحاقن الدم بوجدة، Avenue Errazi, Oujda 60000. من الأفضل التأكد من أوقات العمل قبل الذهاب.",
                ],
                [
                    'keywords' => ['شروط', 'مؤهل', 'العمر', 'السن', 'الوزن', 'الصحة'],
                    'response' => "بشكل عام يمكنك التبرع إذا كان عمرك بين 18 و60 سنة، ووزنك 50 كلغ أو أكثر، وتتمتع بصحة جيدة، وتحمل بطاقة تعريف. القرار النهائي يكون بعد التقييم الطبي في المركز.",
                ],
                [
                    'keywords' => ['كم مرة', 'الفترة', 'متى أتبرع مرة أخرى', 'التكرار'],
                    'response' => "عادة يجب الانتظار حوالي 8 إلى 12 أسبوعا بين عمليتي تبرع بالدم الكامل. إذا تبرعت مؤخرا فالأفضل اتباع توجيهات الطاقم الطبي.",
                ],
                [
                    'keywords' => ['الخطوات', 'العملية', 'كيف يتم', 'الإجراءات'],
                    'response' => "تمر عملية التبرع بعدة مراحل: الاستقبال، استبيان ومقابلة طبية، فحص بسيط، سحب الدم، ثم راحة مع وجبة خفيفة. سحب الدم نفسه يستغرق غالبا حوالي 10 دقائق.",
                ],
                [
                    'keywords' => ['الفوائد', 'لماذا', 'فائدة'],
                    'response' => "التبرع بالدم قد يساعد في إنقاذ عدة أرواح. وهو عمل إنساني مهم وسريع، كما تستفيد عادة من فحص بسيط قبل التبرع.",
                ],
                [
                    'keywords' => ['خطر', 'ألم', 'مخيف', 'مخاطر'],
                    'response' => "التبرع بالدم آمن في العادة. الأدوات معقمة وتستعمل مرة واحدة فقط. قد تشعر بوخزة بسيطة أو تعب خفيف بعد التبرع، لذلك ينصح بشرب الماء والراحة.",
                ],
            ],
            'en' => [
                [
                    'keywords' => ['hello', 'hi', 'hey'],
                    'response' => "Hello! I can help with blood donation questions, the donation process, and donation centers in Oujda.",
                ],
                [
                    'keywords' => ['oujda', 'center', 'centre', 'where can i donate', 'location'],
                    'response' => "In Oujda, the main donation site is the Regional Blood Transfusion Center of Oujda, Avenue Errazi, Oujda 60000. It is best to confirm opening hours before visiting.",
                ],
                [
                    'keywords' => ['eligible', 'eligibility', 'conditions', 'age', 'weight', 'healthy'],
                    'response' => "In general, you may donate blood if you are 18 to 60 years old, weigh at least 50 kg, are in good health, and bring an ID. Final eligibility is always confirmed by the medical staff on site.",
                ],
                [
                    'keywords' => ['frequency', 'how often', 'when can i donate again'],
                    'response' => "A common guideline is to wait about 8 to 12 weeks between whole blood donations. If you donated recently, follow the timing given by the medical team.",
                ],
                [
                    'keywords' => ['process', 'steps', 'how does it work'],
                    'response' => "The process usually includes registration, a short health questionnaire, a basic health check, the blood draw, then rest and a snack. The collection itself often takes around 10 minutes.",
                ],
                [
                    'keywords' => ['benefits', 'why donate'],
                    'response' => "Blood donation can help save several lives. It is a simple act of solidarity and usually includes a brief pre-donation health check.",
                ],
                [
                    'keywords' => ['risk', 'pain', 'scared', 'safe'],
                    'response' => "Blood donation is generally safe. Equipment is sterile and single-use. You may feel a brief needle pinch and sometimes mild tiredness afterward, so resting and hydrating are important.",
                ],
            ],
        ];

        foreach ($knowledge[$lang] ?? $knowledge['fr'] as $item) {
            foreach ($item['keywords'] as $keyword) {
                if (str_contains($message, $keyword)) {
                    return $item['response'];
                }
            }
        }

        return null;
    }

    private function getDefaultFallback(string $lang): string
    {
        if ($lang === 'ar') {
            return "يمكنني مساعدتك في شروط التبرع بالدم، خطوات التبرع، الفوائد والمخاطر، أو أماكن التبرع في وجدة. إذا أردت، اسألني مثلا: هل أنا مؤهل للتبرع؟";
        }

        if ($lang === 'en') {
            return "I can help with blood donation eligibility, the donation process, benefits, risks, and donation centers in Oujda. For example, you can ask: Am I eligible to donate blood?";
        }

        return "Je peux vous aider sur les conditions de don, le déroulement du don, les bénéfices, les risques et les centres de don à Oujda. Par exemple : Suis-je éligible au don du sang ?";
    }

    private function getOutOfScopeResponse(string $lang): string
    {
        if ($lang === 'ar') {
            return "عذرا، يمكنني الإجابة فقط عن الأسئلة المتعلقة بالتبرع بالدم ومراكز التبرع في وجدة.";
        }

        if ($lang === 'en') {
            return "I’m sorry, I can only answer questions related to blood donation and donation centers in Oujda.";
        }

        return "Je suis désolé, je peux uniquement répondre aux questions liées au don de sang et aux centres de don à Oujda.";
    }

    private function buildScopedPrompt(string $message, string $lang): string
    {
        $instructions = match ($lang) {
            'ar' => "أنت مساعد ودود لمنصة BloodConnect. أجب فقط عن مواضيع: التبرع بالدم، شروط وأهلية التبرع، عملية التبرع، فوائد ومخاطر التبرع، ومراكز التبرع بالدم في وجدة بالمغرب. إذا كان السؤال خارج هذا المجال، أجب فقط: \"عذرا، يمكنني الإجابة فقط عن الأسئلة المتعلقة بالتبرع بالدم ومراكز التبرع في وجدة.\" اجعل الإجابة قصيرة وواضحة وعملية، ولا تخترع معلومات غير مؤكدة.",
            'en' => "You are a friendly BloodConnect assistant. Answer only about blood donation, eligibility, the donation process, benefits, risks, frequency, and blood donation centers in Oujda, Morocco. If the question is outside this scope, reply only with: \"I’m sorry, I can only answer questions related to blood donation and donation centers in Oujda.\" Keep answers short, clear, and practical. Do not invent uncertain facts.",
            default => "Tu es un assistant BloodConnect sympathique. Réponds uniquement sur le don de sang, les conditions d'éligibilité, le déroulement du don, les bénéfices, les risques, la fréquence du don et les centres de don à Oujda au Maroc. Si la question est hors sujet, réponds uniquement : \"Je suis désolé, je peux uniquement répondre aux questions liées au don de sang et aux centres de don à Oujda.\" Garde des réponses courtes, claires et utiles. N'invente pas d'informations incertaines.",
        };

        $knowledge = "Knowledge base: Main center in Oujda: Centre Regional de Transfusion Sanguine d'Oujda, Avenue Errazi, Oujda 60000, Morocco. Advise users to confirm opening hours before visiting.";

        return $instructions . "\n\n" . $knowledge . "\n\nUser question: " . $message;
    }
}
