import Link from "next/link";

type Props = React.ComponentProps<"button"> | React.ComponentProps<typeof Link>;

const Button = ({ children, className, ...props }: Props) => (
  <div className="text-[1.5rem] text-white">
    {!("href" in props) ? (
      <button
        {...props}
        className={
          (className || "") +
          " flex items-center rounded-full p-1 outline-none ring-miku-3/80 transition-colors duration-200 ease-in-out hover:bg-black/20 focus-visible:ring"
        }
      >
        {children}
      </button>
    ) : (
      <Link
        {...props}
        className={
          (className || "") +
          " flex items-center rounded-full p-1 outline-none ring-miku-3/80 transition-colors duration-200 ease-in-out hover:bg-black/20 focus-visible:ring"
        }
      >
        {children}
      </Link>
    )}
  </div>
);

export default Button;
