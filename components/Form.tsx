"use client";
import React, { useState } from "react";
import CustomUrl  from "@/components/custom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CopyIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface Message {
  success: boolean;
  original: string;
  short: string | number;
}

const Form = () => {
  const router = useRouter()
  const [url, setUrl] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({
    success: false,
    original: "",
    short: "",
  });

  const submitHandler: () => void = async () => {
    if ((url.startsWith("http://") || url.startsWith("https://")) && url.length > 3 && url.includes(".") && !url.includes("#") && !url.includes("@") && !url.includes("*") && !url.includes("!")) {
      setIsLoading(true)
      const dataToSend = { url, custom: isAvailable ? customUrl : null };
      try {
        const req = await fetch("/api/shorten", {
          method: "POST",
          body: JSON.stringify(dataToSend),
        });
        const response = await req.json();
        if (response.warning) {
          toast(response.warning, {
            description: response.warningDescription,
          });
        }
        if (response.success) {
          setMessage({ success: true, original: url, short: response.shorturl });
          toast("Your short link is ready!", {
            description: `/${response.shorturl} belongs to you now!`,
            action: {
              label: "Visit",
              onClick: () => window.open(`/${response.shorturl}`, "_ blank"),
            },
          });
          setUrl("");
          setCustomUrl("")
          setIsAvailable(null)
        }
      } catch (error) {
        toast("Something went wrong!", {
          description: (error as Error).message,
        });
      }finally{
        setIsLoading(false);
      }
    } else { // If Front-end validation failed, this piece of code will be triggered
      setIsLoading(false);
      setMessage({
        success: false,
        original: "URL seems to be incorrect!",
        short: "URL starts with 'http://' or 'https://'",
      });
      toast("URL seems to be incorrect!", {
        description: "URL starts with 'http://' or 'https://'",
      });
    }
  };

  const onCopy = async (text: string | number) => {
    const shortedUrl = window.location.origin + "/" + text
    await navigator.clipboard.writeText(shortedUrl)
    toast("Short URL Copied!", {
      description: "Short URL Copied To Your Clipboard!",
    });
  }

  return (
    <>
      <div className="flex py-4 justify-start items-center w-full h-16 mb-5 ml-5">
        <div className="text-zinc-400 font-bold text-[16px] md:text-[19px]">
          {message.success ? (
            <>
              <span className="text-center">Your Short Link Created: </span>
              <br />
              Original URL: <span className="text-zinc-600 text-base">{message.original}</span>
              <br />
              
              <div className="flex items-center space-x-1">
               <span> Short URL: </span>
                {" "}
                <a
                  className="text-green-500 text-xl cursor-pointer hover:text-green-300"
                  href={`/${message.short}`} target="_ blank"
                >
                {" "} /{message.short}
                </a>

                <CopyIcon className="cursor-pointer" width={20} height={20} onClick={() => onCopy(message.short)} />
              </div>
            </>
          ) : (
            <>
              {message.original}
              <br />
              {message.short}
            </>
          )}
        </div>
      </div>
      <Label htmlFor="url">URL</Label>
      <Input onChange={(e) => setUrl(e.target.value)} value={url} className="p-6 text-[19px]" type="url" id="url" placeholder="Enter your URL" />
      <div className="w-full justify-center flex gap-x-4">
        <CustomUrl isAvailable={isAvailable} setIsAvailable={setIsAvailable} customUrl={customUrl} setCustomUrl={setCustomUrl} />
        <Button onClick={submitHandler} disabled={isLoading} variant="secondary" className="text-[18px] hover:scale-110">
          Shorten URL
        </Button>
      </div>
    </>
  );
};

export default Form;
