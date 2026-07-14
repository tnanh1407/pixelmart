export default function StoreBanner() {
  return (
    <div className="relative w-full h-35 rounded-b-2xl overflow-hidden">
      <img src="/Pointmallvoucher/banner_Pointmallvoucher.png" alt="Banner" className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-end pr-12">
        <h1 className="text-3xl font-bold text-white drop-shadow-md capitalize">Khám phá gian hàng</h1>
      </div>
    </div>
  )
}
