"use client";

import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/notification-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function NotificationBell() {
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const router = useRouter();

    const handleNotificationClick = (notification: any) => {
        markAsRead(notification.id);
        if (notification.link) {
            router.push(notification.link);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                {/* ... same trigger ... */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b font-semibold flex justify-between items-center bg-muted/40">
                    <span>Notifications</span>
                    {unreadCount > 0 && <Badge variant="secondary">{unreadCount} New</Badge>}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            No new notifications.
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map(n => (
                                <button
                                    key={n.id}
                                    className={`p-4 text-left border-b last:border-0 hover:bg-accent transition-colors ${!n.read ? 'bg-accent/30' : ''}`}
                                    onClick={() => handleNotificationClick(n)}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`font-medium text-sm ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {n.title}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {n.message}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
