export const drugs_directory = [
    { 
        name: "Marijuana", 
        description: "Marijuana or weed is tubular", 
        id: "drug_marijuana"
    },
    { 
        name: "Kratom", 
        description: "Kratom or mitragyna speciosa is a...", 
        id: "drug_kratom"
    },
    {
        name: "Adderall", 
        description: "Adderall or Amphetamine/d-amphetamine is a...", 
        id: "drug_adderall"
    }
];


export const animator = {
    animate: (config) => {
        this.duration;
        element.animate(animations[animation], configs[config]);
    },
    animations: {
        slideDown: [
                { transform: 'translateY(70px)'},
                { transform: 'translateY(0px)'}
            ],
        slideUp: [
            { transform: 'translateY(0px)'},
            { transform: 'translateY(70px)'}
        ],
        slideLeft: [
            { transform: 'translateX(0px)' },
            { transform: 'translateX(-50px)'}
        ],
        slideRight: [
            { transform: 'translateX(0px)'},
            { transform: 'translateX(50px'}
        ]
    },
    configs: {
        basic: {
            fill: "forwards",
            easing: "ease-in-out"
        }
    },
    variables: {
        duration: {
            short: 200,
            medium: 500,
            long: 800,
        }
    }
}