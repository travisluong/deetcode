import {
  DiscordLogoIcon,
  EnvelopeClosedIcon,
  LayersIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
  VideoIcon,
} from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="text-center border-t border-gray-400 dark:border-gray-800 p-5 text-muted-foreground flex justify-center">
      <div className="flex flex-col md:flex-row gap-5">
        <div>&copy; DeetCode {new Date().getFullYear()}</div>
        <ul className="flex gap-5 items-center">
          <li>
            <a href="https://www.fullstackbook.com">
              <LayersIcon className="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/@fullstackbook">
              <VideoIcon className="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/travisluong">
              <LinkedInLogoIcon className="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="https://twitter.com/TravisLuong">
              <TwitterLogoIcon className="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="https://discord.gg/yfntMbzR">
              <DiscordLogoIcon className="w-6 h-6" />
            </a>
          </li>
          <li>
            <a href="mail&#116;o&#58;s%75p&#112;o%72&#116;&#64;deet&#99;o&#100;e&#46;&#37;&#54;&#51;om">
              <EnvelopeClosedIcon className="w-6 h-6" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
