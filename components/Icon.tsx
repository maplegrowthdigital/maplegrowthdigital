interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
}

export function Icon({ name, size = 24, className = "", ...props }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...props}>
      <use href={`/icons-sprite.svg#${name}`} />
    </svg>
  );
}
