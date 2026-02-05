import React from "react";
import { Button } from "@/components/ui/button";

function NoDataFound({
  title,
  description,
  buttonText,
  buttonAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground mb-6">
        {description}
      </p>

      {buttonText && buttonAction && (
        <Button onClick={buttonAction}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}

export default NoDataFound;
