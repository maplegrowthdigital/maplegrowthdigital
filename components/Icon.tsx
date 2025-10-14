interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
}

export function Icon({ name, size = 24, className = "", role, ...props }: IconProps) {
  const { ["aria-hidden"]: ariaHiddenProp, focusable, ...rest } = props as IconProps & {
    "aria-hidden"?: boolean;
    focusable?: string;
  };

  const ariaHidden = ariaHiddenProp ?? true;
  const resolvedRole = role ?? (ariaHidden ? "presentation" : undefined);
  const resolvedFocusable = ariaHidden ? "false" : focusable;

  return (
    <svg
      width={size}
      height={size}
      className={className}
      role={resolvedRole}
      aria-hidden={ariaHidden}
      focusable={resolvedFocusable}
      {...rest}
    >
      <use href={`/icons-sprite.svg#${name}`} />
    </svg>
  );
}
