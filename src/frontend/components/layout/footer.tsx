export function Footer() {
  return (
    <footer className="border-t py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built for{' '}
          <a
            href="https://earn.superteam.fun/listing/sanctum-gateway-track"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Sanctum Gateway Track
          </a>
          . Powered by{' '}
          <a
            href="https://gateway.sanctum.so"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Gateway API
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
