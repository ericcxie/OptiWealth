export default function Details() {
  return (
    // <!-- How it works -->
    <section className="bg-gradient-to-r from-purple-950 via-background to-blue-950 text-white sectionSize">
      <div>
        <h2 className="mb-4 text-5xl font-inter font-bold">How it works</h2>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-white h-12 w-12 flex justify-center items-center mb-3">
            1
          </div>
          <h3 className="font-inter font-medium text-xl mb-2">Scan</h3>
          <p className="text-center font-inter">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </p>
        </div>
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-white h-12 w-12 flex justify-center items-center mb-3">
            2
          </div>
          <h3 className="font-inter font-medium text-xl mb-2">Modify</h3>
          <p className="text-center font-inter">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </p>
        </div>
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-white h-12 w-12 flex justify-center items-center mb-3">
            3
          </div>
          <h3 className="font-inter font-medium text-xl mb-2">Optimize</h3>
          <p className="text-center font-inter">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </section>
  );
}
