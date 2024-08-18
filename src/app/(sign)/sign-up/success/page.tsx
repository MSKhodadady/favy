import Link from "next/link";
import { SignLayout } from "../../SignLayout";

export default function RegisterSuccessPage() {
  return (
    <SignLayout title="ثبت نام انجام شده و ایمیل تایید برای شما ارسال شد.">
      <div className="flex items-center">
        <div className="text-primary text-5xl mx-5">&#10004;</div>
        <div>
          <p className="text-lg">
            پس از مراجعه به ایمیل خود، روی لینک ارسال شده کلیک کرده تا حساب شما
            تایید گردد.
          </p>
          <p>در صورت نبود ایمیل، پوشه اسپم ایمیل خود را چک کنید.</p>
        </div>
      </div>

      <Link href="/">
        <button type="button" className="btn btn-primary w-full mt-3">
          بازگشت به خانه
        </button>
      </Link>
    </SignLayout>
  );
}
