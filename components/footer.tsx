export default function Footer() {
  return (
    <footer className="text-center border-t-2 p-5 text-muted-foreground">
      &copy; DeetCode {new Date().getFullYear()}
    </footer>
  );
}
