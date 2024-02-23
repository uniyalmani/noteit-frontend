


function About(){

    return (
    <section className="bg-gray-50 dark:bg-gray-900 h-screen" >
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Remember It All</h1>
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Unleash Your Limitless Future with Note It
                No more fleeting whispers, no more lost masterpieces. Note It isn't just a place to capture scattered thoughts and fleeting inspirations; it's a portal to unlock your full creative potential. Imagine a vibrant playground where ideas dance freely, 
                where every spark of brilliance has a safe haven to ignite. That's what Note It offers.</p>
            <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Read more about our app 
                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
        </div>
    </div>
</section>
    )
}

export default About