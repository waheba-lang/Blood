<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index($requestId)
    {
        $comments = Comment::with('user:id,name,role')->where('donation_request_id', $requestId)->orderBy('created_at', 'desc')->get();
        return response()->json($comments);
    }

    public function store(Request $request, $requestId)
    {
        $request->validate([
            'body' => 'required|string|max:1000'
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'donation_request_id' => $requestId,
            'body' => $request->body
        ]);

        // Return with user relation for immediate display
        return response()->json($comment->load('user:id,name,role'), 201);
    }
}
