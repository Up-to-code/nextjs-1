import Image from "next/image";

interface EmptyStateProps {
    title: string;
    description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="relative w-48 h-48 mb-6 opacity-90">
                <Image
                    src="/machine-learning.svg"
                    alt="Empty State"
                    fill
                    className="object-contain"
                />
            </div>
            <h3 className="text-xl font-bold text-[#242C5A] mb-2">{title}</h3>
            <p className="text-gray-500 max-w-sm text-center">
                {description}
            </p>
        </div>
    );
}
