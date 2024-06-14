import {
  DiscordLogoIcon,
  LinkedInLogoIcon,
  RocketIcon,
  TwitterLogoIcon,
  VideoIcon,
} from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="text-center border-t border-gray-400 dark:border-gray-800 p-5 text-muted-foreground flex justify-center">
      <div className="flex gap-5">
        <div>&copy; DeetCode {new Date().getFullYear()}</div>
        <ul className="flex gap-5 items-center">
          <li>
            <a href="https://www.fullstackbook.com">
              <RocketIcon className="w-6 h-6" />
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
            <a href="mailto:support@deetcode.com">support@deetcode.com</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
