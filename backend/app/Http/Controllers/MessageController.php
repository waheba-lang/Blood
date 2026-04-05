<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function index($userId)
    {
        $currentUserId = auth()->id();
        
        return Message::where(function($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)->where('receiver_id', $userId);
        })->orWhere(function($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $userId)->where('receiver_id', $currentUserId);
        })->with(['sender', 'receiver'])
          ->orderBy('created_at', 'asc')
          ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
        ]);

        broadcast(new MessageSent($message->load('sender')))->toOthers();

        return $message->load('sender');
    }

    public function getConversations()
    {
        $userId = auth()->id();

        // Get unique users who have exchanged messages with the current user
        $userIds = DB::table('messages')
            ->where('sender_id', $userId)
            ->distinct()
            ->pluck('receiver_id')
            ->merge(
                DB::table('messages')
                    ->where('receiver_id', $userId)
                    ->distinct()
                    ->pluck('sender_id')
            )
            ->unique();

        return User::whereIn('id', $userIds)->get();
    }
}
