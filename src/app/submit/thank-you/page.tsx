import { TextCode, TextH1 } from "../../../../components/ui/typography";

const ThankYouPage = () => {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen text-center p-8">
      <TextH1>Thank You!</TextH1>
      <TextCode>
        Your response has been recorded. Thank you for serving.
      </TextCode>
    </main>
  );
};

export default ThankYouPage;
