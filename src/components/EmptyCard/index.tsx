import { Text } from "@wordpress/ui";
import { Button } from "@wordpress/components";
import "./EmptyCard.css";

interface EmptyPlayersStateProps {
  onButtonClick?: () => void;
  buttonText?: string;
  buttonIcon?: any;
  heading?: string;
  description?: string;
  imageSrc?: string;
}

const EmptyPlayersState = ({
  onButtonClick,
  buttonText,
  buttonIcon,
  heading,
  description,
  imageSrc,
}: EmptyPlayersStateProps) => {
  return (
    <div className="emptyContainer">
      <div className="emptyImageContainer">
        {/* <img
          className="emptyImage"
          alt="A clean, modern 3D illustration of a sleek video player interface"
          src={
            imageSrc ||
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCiq0Gs0GMXBkhnlLZHXjC5BxDlWfF2lF8skYGk2HDOu8ZPHKsS6-xT3Z_LGsyeQQelFbR7AfHeS-9OWhP6ZVE9d43O30pOXUHK4NiyFMul53Bp-FiYM6aI1YVz-EYX-YcAfkMn825CW2o6oJO76iisA1SW7OiV94zz7I1FnjLKuBD8byDQH-oCBZNB-JuqP6QHiSNJ8LiP5N_2uLFJTqiL7bwIgNBu3ECH71rEV4XqFsuyzFGNLA1m"
          }
        /> */}
        <span className="material-symbols-outlined filled">
          {imageSrc || "play_circle"}
        </span>
      </div>

      <Text variant="body-xl" style={{ marginBottom: "1rem" }}>
        {heading || "No video players found"}
      </Text>

      <Text
        variant="body-lg"
        style={{
          marginBottom: "1.5rem",
          maxWidth: "25rem",
        }}
      >
        {description ||
          "Create and customize a video player to match your brand before embedding it on your site."}
      </Text>

      <Button
        __next40pxDefaultSize={true}
        variant="primary"
        icon={buttonIcon ? buttonIcon : "plus"}
        onClick={onButtonClick}
      >
        {buttonText || "Create New Player"}
      </Button>
    </div>
  );
};

export default EmptyPlayersState;
