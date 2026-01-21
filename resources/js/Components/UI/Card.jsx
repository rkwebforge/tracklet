import clsx from "clsx";
import { memo } from "react";

const Card = memo(function Card({ children, className = "", ...props }) {
  return (
    <div className={clsx("card", className)} {...props}>
      {children}
    </div>
  );
});

export default Card;
