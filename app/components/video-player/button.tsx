type Props = React.ComponentProps<"button">;

const Button = ({ children, className, ...props }: Props) => (
  <div className="text-[1.5rem] text-white">
    <button
      {...props}
      className={
        (className || "") + " flex items-center rounded-full bg-black/40 p-1"
      }
    >
      {children}
    </button>
  </div>
);

export default Button;
