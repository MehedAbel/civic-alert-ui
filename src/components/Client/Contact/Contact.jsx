import Navbar from '../Navbar/Navbar.jsx';
import Headset from '../../../assets/headset.png';
import ThumbUp from '../../../assets/thumb-up.png';
import Mail from '../../../assets/mail.png';
import Phone from '../../../assets/telephone.png';

export default function Contact() {

	return (
		<div className="flex flex-col font-syne h-screen bg-gray-100">
			<Navbar />
			<div className='flex flex-col p-9 gap-6 bg-gray-100'>
				<div className='flex'>
					<h1 className='text-2xl font-semibold'>Contact</h1>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='bg-white p-4 w-full flex flex-col rounded-md justify-between'>
                        <h2 className='text-xl font-medium'>Centru de Asistenta</h2>
                        <p className='text-gray-400 text-sm'>Pentru asistenta personalizata, va rugam sa accesati centrul nostru de suport online</p>
                        <div className='flex flex-col gap-2 items-center mt-6'>
                            <div className='bg-sky-100 rounded-full p-6'>
                                <img src={Headset} alt="" className='h-16' />
                            </div>
                            <h3 className='font-bold text-md mt-4'>Aveti nevoie de ajutor?</h3>
                            <p className='text-center text-sm text-gray-600'>
                                Echipa noastra de suport este pregatita sa va ajute cu orice intrebare sau 
                                problema intampinata
                            </p>
                            <a className='bg-ocean-200 text-white px-4 py-2 rounded-md text-sm mt-3' href='https://share.hsforms.com/1pnr84g2xSCaBDJDhZRr2bwsuexz'>Accesati centrul de suport</a>
                        </div>
                        <div className='flex flex-col items-center mt-8'>
                            <hr className='w-full'/>
                            <p className='text-center text-sm text-gray-400 mt-4'>
                                Centrul nostru de suport ofera articole de ajutor, tutoriale video si posibilitatea de a deschide
                                un tichet de asistenta. 
                            </p>
                        </div>
                    </div>
                    <div className='bg-white p-4 w-full flex flex-col rounded-md justify-between'>
                        <h2 className='text-xl font-medium'>Feedback</h2>
                        <p className='text-gray-400 text-sm'>Ajutati-ne sa imbunatatim platforma Civic Alert prin feedback-ul dvs.</p>
                        <div className='flex flex-col gap-2 items-center mt-6'>
                            <div className='bg-green-100 rounded-full p-6'>
                                <img src={ThumbUp} alt="" className='h-16' />
                            </div>
                            <h3 className='font-bold text-md mt-4'>Parerea dvs. conteaza!</h3>
                            <p className='text-center text-sm text-gray-600'>
                                Feedback-ul utilizatorilor ne ajuta sa imbunatatim constant serviciile si
                                sa oferim o experienta mai buna pentru toti cetatenii
                            </p>
                            <a className='bg-green-500 text-white px-4 py-2 rounded-md text-sm mt-3' href="https://docs.google.com/forms/d/e/1FAIpQLSfd1CibXfPfN7aTZVsuG66wrzVZaKxHvOefGBeAtsyckKuJug/viewform">Completati formularul de feedback</a>
                        </div>
                        <div className='flex flex-col items-center mt-8'>
                            <hr className='w-full'/>
                            <p className='text-center text-sm text-gray-400 mt-4'>
                                Formularul nostru de feedback este anonim sa si va va lua cateva minute sa-l completati 
                            </p>
                        </div>
                    </div>
				</div>
                <div className='flex flex-col items-center mt-8 bg-white w-full p-4 rounded-md'>
                    <div className='flex flex-col w-full'>
                        <h2 className='text-xl font-medium'>Informatii de contact</h2>
                        <p className='text-gray-400 text-sm'>Alte modalitati de a ne contacta</p>
                    </div>
                    <div className='flex justify-between w-full mt-5 mb-2'>
                        <div className='flex gap-3 flex-1'>
                            <img src={Mail} alt="" className='h-9' />
                            <div>
                                <h3 className='text-md font-medium'>Adresa de e-mail</h3>
                                <a className='text-sm text-gray-600 underline' href="mailto:7YHt9@example.com">7YHt9@example.com</a>
                                <p className='text-xs text-gray-600'>Raspundem la emailuri in termen de 24 - 48 de ore</p>
                            </div>
                        </div>
                        <div className='flex gap-3 flex-1'>
                            <img src={Phone} alt="" className='h-9' />
                            <div>
                                <h3 className='text-md font-medium'>Telefon</h3>
                                <p className='text-sm text-gray-600 underline'>+40 123 456 789</p>
                                <p className='text-xs text-gray-600'>Program: Luni - Vineri, 9:00 - 18:00</p>
                            </div>
                        </div>
                    </div>
                </div>
			</div>
		</div>
	);
}