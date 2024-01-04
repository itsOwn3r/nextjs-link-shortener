"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface CustomUrlProps{
  isAvailable: boolean | null;
  setIsAvailable:  React.Dispatch<React.SetStateAction<boolean | null>>
  customUrl: string | null;
  setCustomUrl: React.Dispatch<React.SetStateAction<string | null>>
}

const CustomUrl: React.FC<CustomUrlProps> = ({isAvailable, setIsAvailable, customUrl, setCustomUrl}) => {
  const [isLoading, setIsLoading] = useState(false);

  const checkHandler:() => void = async () => {
    setIsLoading(true);
    try {
      const req = await fetch("/api/check", {
        method: "POST",
        body: JSON.stringify({ url: customUrl }),
      });
      const data = await req.json();
      setIsAvailable(data.available);
    } catch (error) {
      toast("Something went wrong!", {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="min-w-[7rem]">
          <HoverCard>
            <HoverCardTrigger className="w-full flex justify-center items-center text-[18px] hover:scale-110">
              {isAvailable ? (
                <><CheckIcon color="green" width={30} height={30} />
                <span className="text-green-600 font-bold text-xl">/{customUrl}</span>
                </>
              ) : "Set Custom URL"}
             
            </HoverCardTrigger>
            {customUrl && <HoverCardContent>Custom URL</HoverCardContent>}
          </HoverCard>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Set your custom Short URL </DrawerTitle>
            <DrawerDescription>
              Your custom link gonna look like: <br /> {window.location.origin}/
              <span className={isAvailable ? "text-green-500" : "text-red-600"}>
                {customUrl ? customUrl : "custom"}
              </span>
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Input
                className={`${isAvailable && "border-green-500 text-green-500"} ${isAvailable === false && "border-red-600 text-red-600"} ${isAvailable === null && "border-white"}`}
                onChange={(e) => setCustomUrl(e.target.value)}
                defaultValue={customUrl || ""}
              />
            </div>
            <p>Keep in mind, Short URLs will be case sensitive.</p>
          </div>
          <DrawerFooter className="flex flex-col justify-evenly mb-4 gap-2">
            <Button disabled={isLoading} onClick={checkHandler}>
              Check
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={isLoading} className={isAvailable ? "bg-green-700 hover:bg-green-600" : ""}>
                {isAvailable ? "Choose" : "Close"}
              </Button>
            </DrawerClose>

            {isAvailable !== null && <DrawerClose asChild  onClick={() => {
                setIsAvailable(null)
                setCustomUrl(null)
            }}>
              <Button variant="outline" >
                Cancel
              </Button>
            </DrawerClose>}

          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CustomUrl;