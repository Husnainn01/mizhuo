import ClientWrapper from "./ClientWrapper";
import HomePage from "../home-page";

// Export as static - this helps with deployment
export const dynamic = 'force-static';

export default function Home() {
  return (
    <ClientWrapper>
      <HomePage />
    </ClientWrapper>
  );
}
