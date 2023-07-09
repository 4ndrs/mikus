import { forwardRef } from "react";

import NativeLink from "next/link";

type Props = React.ComponentPropsWithRef<typeof NativeLink>;

const Link = forwardRef<HTMLAnchorElement, Props>(
  ({ children, ...props }: Props, ref) => (
    <NativeLink
      ref={ref}
      {...props}
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("touchedlink", { detail: props.href })
        )
      }
    >
      {children}
    </NativeLink>
  )
);

Link.displayName = "Link";

export default Link;
