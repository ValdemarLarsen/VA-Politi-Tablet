import ChartFilterDemo from "@/app/sider/minprofil/AttendanceGrid"

export default function BrugerProfilSide() {
    return (
      <div className="h-full w-full">
        <div className="grid h-full w-full grid-cols-2 grid-rows-5 gap-2 bg-red-100">
          <div className="bg-blue-200 flex items-center justify-center border">1</div>
          <div className="col-start-1 row-start-2">
            <ChartFilterDemo />
          </div>
          <div className="col-start-1 row-start-4 bg-pink-200 flex items-center justify-center border">4</div>
          <div className="col-start-1 row-start-5 bg-purple-200 flex items-center justify-center border">5</div>
          <div className="col-start-2 row-start-1 row-span-4 bg-orange-300 flex items-center justify-center border">6</div>
          <div className="col-start-2 row-start-5 bg-gray-300 flex items-center justify-center border">7</div>
        </div>
      </div>
    );
  }
  