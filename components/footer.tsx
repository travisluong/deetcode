export default function Footer() {
  return (
    <footer className="text-center border-t border-gray-400 dark:border-gray-800 p-1 text-muted-foreground">
      &copy; DeetCode {new Date().getFullYear()}
    </footer>
  );
}
