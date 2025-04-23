import Navbar from '../Navbar/Navbar.jsx';
import Faq from '../../../constants/Faq.js';

export default function FAQ() {

	return (
		<div className="flex flex-col font-syne">
			<Navbar />
			<div className='flex flex-col p-9 gap-6'>
				<div className='flex flex-col items-center'>
					<h1 className='text-2xl font-medium'>Intrebari Frecvente</h1>
					<p className='text-gray-600'>Aveti vreo intrebare? Suntem aici sa raspundem la toate intrebarile dumneavoastra</p>
				</div>
				<div className='flex justify-center'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{Faq.map((faq, index) => (
							<div key={index} className='flex flex-col mt-4 max-w-xl'>
								<h2 className='text-lg font-medium text-ocean-200'>{faq.question}</h2>
								<p className='text-gray-600 text-sm'>{faq.answer}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
