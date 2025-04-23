import Navbar from '../Navbar/Navbar.jsx';

export default function Contact() {

	return (
		<div className="flex flex-col font-syne">
			<Navbar />
			<div className='flex flex-col p-9 gap-6'>
				<div className='flex flex-col items-center'>
					<h1 className='text-2xl font-medium'>Pagina de contact</h1>
					<p className='text-gray-600'>Aveti vreo intrebare? Suntem aici sa raspundem la toate intrebarile dumneavoastra</p>
				</div>
				<div className='flex justify-center'>
					
				</div>
			</div>
		</div>
	);
}