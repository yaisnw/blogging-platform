import Footer from "../organisms/Footer"
import HeroSection from "../organisms/HeroSection"
import ServicesSection from "../organisms/ServicesSection"
import UserSection from "../organisms/UserSection"
import HomeTemplate from "../templates/HomeTemplate"

const HomePage = () => {
    return (
        <div>
            <HomeTemplate>
                <HeroSection />
                <ServicesSection />
                <UserSection />
            </HomeTemplate>
            <Footer/>
        </div>
    )
}

export default HomePage