import Image from "next/image";

const pages = [
  "/collectors-book/cover.png",
  "/collectors-book/page-01.png",
  "/collectors-book/page-02.png",
  "/collectors-book/page-03.png",
  "/collectors-book/page-04.png",
  "/collectors-book/page-05.png",
  "/collectors-book/page-06.png",
  "/collectors-book/page-07.png",
  "/collectors-book/page-08.png",
  "/collectors-book/page-09.png",
  "/collectors-book/page-10.png",
  "/collectors-book/page-11.png",
  "/collectors-book/page-12.png",
  "/collectors-book/page-13.png",
];

export default function BookPage() {
  return (
    <main className="min-h-screen bg-black px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-4 sm:gap-6">
        {pages.map((page, index) => (
          <section key={page} className="w-full">
            <Image
              src={page}
              alt={
                index === 0
                  ? "BTC CLUB Collector's Book Cover"
                  : `BTC CLUB Collector's Book Page ${index}`
              }
              width={1600}
              height={900}
              priority={index === 0}
              sizes="(max-width: 640px) 100vw, 820px"
              className="h-auto w-full"
            />
          </section>
        ))}
      </div>
    </main>
  );
}