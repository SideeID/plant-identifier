// Typography styles based on the design system
export const typography = {
  fontSizes: {
    heading: {
      large: 28,
      medium: 24,
    },
    subheading: {
      large: 20,
      medium: 18,
      small: 16,
    },
    body: 16,
    caption: 14,
    small: 12,
  },
  fontWeights: {
    regular: 'normal' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: 'bold' as const,
  },
};

export default typography;
