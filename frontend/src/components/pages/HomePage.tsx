import SEO from "../atoms/SEO"
import HeroSection from "../organisms/HeroSection"
import ServicesSection from "../organisms/ServicesSection"
import UserSection from "../organisms/UserSection"
import HomeTemplate from "../templates/HomeTemplate"

const HomePage = () => {
    return (
        <>
            <main>
                <SEO
                    title="Home"
                    description="Discover inspiring stories, tutorials, and personal insights from many writers."
                />
                <HomeTemplate>
                    <HeroSection />
                    <ServicesSection />
                    <UserSection />
                </HomeTemplate>
            </main>
        </>
    )
}

export default HomePage