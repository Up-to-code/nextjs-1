import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Phone, User as UserIcon } from "lucide-react";

interface CustomerInfoCardProps {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    orderCount?: number;
}

export function CustomerInfoCard({
    name,
    email,
    phone = "0500000000",
    address = "الرياض، المملكة العربية السعودية",
    orderCount,
}: CustomerInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    معلومات العميل
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold">{name}</div>
                        <div className="text-sm text-muted-foreground">عميل متميز</div>
                    </div>
                </div>

                <div className="border-t pt-4 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span dir="ltr">{phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{address}</span>
                    </div>
                    {orderCount !== undefined && (
                        <div className="pt-2 flex justify-between items-center text-muted-foreground">
                            <span>إجمالي الطلبات:</span>
                            <span className="font-medium text-foreground">{orderCount}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
