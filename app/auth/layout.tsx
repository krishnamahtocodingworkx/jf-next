export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-white lg:flex">
        <svg
          className="h-full w-full"
          viewBox="0 0 615 588"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-0.00928363 7.67191C117.556 39.2999 326.377 156.732 327.195 355.359C327.839 511.718 148.753 515.419 107.802 414.805C66.85 314.191 133.936 239.81 213.214 239.483C326.717 239.016 350 323.5 391.5 424C459.602 588.921 550.5 601 614.5 563.5"
            stroke="url(#paint0_linear_1267_452)"
            strokeWidth="12"
            strokeLinecap="square"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1267_452"
              x1="615"
              y1="583"
              x2="-2.46904"
              y2="7.64984"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#67D05D" />
              <stop offset="0.302083" stopColor="#1DD6AE" />
              <stop offset="0.651042" stopColor="#17C9DC" />
              <stop offset="1" stopColor="#C747F4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-1 flex-col bg-slate-50">
        <div className="flex flex-1 items-center justify-center px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
