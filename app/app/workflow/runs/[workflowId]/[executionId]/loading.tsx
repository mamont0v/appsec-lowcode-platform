import { Loader2Icon } from "lucide-react"


export default function Loading() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
        </div>
    );
}