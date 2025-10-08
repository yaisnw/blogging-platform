import SEO from "../atoms/SEO"
import Footer from "../organisms/Footer"
import HeroSection from "../organisms/HeroSection"
import ServicesSection from "../organisms/ServicesSection"
import UserSection from "../organisms/UserSection"
import HomeTemplate from "../templates/HomeTemplate"

const HomePage = () => {
    return (
        <div>
            <SEO
                title="Home"
                description="Discover inspiring stories, tutorials, and personal insights from many writers."
            />

            <HomeTemplate>
                <HeroSection />
                <ServicesSection />
                <UserSection />
            </HomeTemplate>
            <Footer />
        </div>
    )
}

export default HomePage