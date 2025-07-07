import HeroSection from "../organisms/HeroSection"
import ServicesSection from "../organisms/ServicesSection"
import UserSection from "../organisms/UserSection"
import HeroTemplate from "../templates/HeroTemplate"

const HomePage = () => {
    return (
        <div>
            <HeroTemplate>
                <HeroSection />
                <ServicesSection />
                <UserSection />
            </HeroTemplate>
        </div>
    )
}

export default HomePage