import { CheckIcon } from "lucide-react";

type AttendanceBoxProps = {
    month: string;
    count: number;
    active?: boolean;
};

function AttendanceBox({ month, count, active }: AttendanceBoxProps) {
    return (
        <div
            className={`relative flex flex-col items-center justify-center rounded-md px-3 py-2 border text-sm font-semibold ${active
                    ? "bg-green-600 text-white border-green-700"
                    : "bg-black/10 text-white/80 border-white/20"
                }`}
        >
            <div className="uppercase tracking-widest text-xs">{month}</div>
            <div className="text-lg font-bold">{count}</div>
            {active && (
                <CheckIcon className="absolute top-1 right-1 h-4 w-4 text-green-300" />
            )}
        </div>
    );
}

export default function AttendanceGrid() {
    const data = [
        { month: "JUL", count: 20, active: true },
        { month: "JUN", count: 17 },
        { month: "MAY", count: 31 },
        { month: "MAY", count: 6, active: true },
        { month: "APR", count: 25 },
        { month: "MAR", count: 18 },
    ];

    return (
        <div className="space-y-2">
            <h2 className="text-white text-sm font-semibold">Attendance</h2>
            <div className="flex gap-2">
                {data.map((item, index) => (
                    <AttendanceBox
                        key={index}
                        month={item.month}
                        count={item.count}
                        active={item.active}
                    />
                ))}
            </div>
        </div>
    );
}
