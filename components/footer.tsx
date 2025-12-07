import { TwitterLogoIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="text-center border-t border-gray-400 dark:border-gray-800 p-5 text-muted-foreground flex justify-center">
      <div className="flex flex-col md:flex-row gap-5">
        <div>&copy; DeetCode {new Date().getFullYear()}</div>
        <ul className="flex gap-5 items-center">
          <li>
            <a href="https://twitter.com/TravisLuong">
              <TwitterLogoIcon className="w-6 h-6" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
