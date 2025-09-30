
type Props = {
    tabPanel: React.ReactNode
    tabContent: React.ReactNode
}

const SearchTemplate: React.FC<Props> = ({ tabPanel, tabContent }) => {
    return (
        <div >
            <div >  
                {tabPanel}
                <div>
                    {tabContent}
                </div>
            </div>
        </div>
    )
}

export default SearchTemplate
