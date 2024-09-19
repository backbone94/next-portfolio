export default function Education() {
  return (
    <section
      id="education"
      className="container mx-auto p-8 my-12 max-w-2xl bg-gradient-to-r from-white via-gray-100 to-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="text-center text-4xl font-extrabold mb-8 text-gray-800">EDUCATION</div>
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
          <div className="text-lg font-bold text-gray-800">아주대학교 소프트웨어학과</div>
          <div className="text-gray-500">2018.03 ~ 2025.02 졸업예정</div>
        </div>
      </div>
    </section>
  );
}
