import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { Eye, EyeClosed } from "lucide-react";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

const PasswordInput: React.FC<PasswordInputProps> = ({
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn(
          "pr-12 placeholder:tracking-normal",
          !showPassword && "tracking-widest",
          className
        )}
        {...props}
      />

      <Toggle
        type="button"
        pressed={showPassword}
        onPressedChange={setShowPassword}
        aria-label={showPassword ? "Hide password" : "Show password"}
        title={showPassword ? "Hide password" : "Show password"}
        className="size-8 absolute top-1/2 -translate-y-1/2 right-0.5"
      >
        {showPassword ? <EyeClosed /> : <Eye />}
      </Toggle>
    </div>
  );
};

export default PasswordInput;
