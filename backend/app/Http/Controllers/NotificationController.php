<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return response()->json(
            Notification::where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    /**
     * Mark the specified notification as read.
     */
    public function update(Request $request, string $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)->findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    /**
     * Remove the specified notification.
     */
    public function destroy(Request $request, string $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)->findOrFail($id);
        $notification->delete();

        return response()->json(['message' => 'Notification supprimée']);
    }
}
