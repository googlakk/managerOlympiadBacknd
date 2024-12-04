import type { Struct, Schema } from '@strapi/strapi';

export interface LayoutOlympiadSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_olympiad_sections';
  info: {
    displayName: 'Olympiad section';
    description: '';
  };
  attributes: {
    olympiads: Schema.Attribute.Relation<'oneToMany', 'api::olympiad.olympiad'>;
    heading: Schema.Attribute.String;
    subHeading: Schema.Attribute.Text;
  };
}

export interface LayoutHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_hero_sections';
  info: {
    displayName: 'Hero section';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    subHeading: Schema.Attribute.Text;
    ctaButton: Schema.Attribute.Component<'components.link', false>;
    background: Schema.Attribute.Media<'images'>;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'header';
    description: '';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.Component<'components.link', true>;
    ctaButton: Schema.Attribute.Component<'components.link', false>;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
    description: '';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.Component<'components.link', true>;
    text: Schema.Attribute.String;
  };
}

export interface ComponentsScore extends Struct.ComponentSchema {
  collectionName: 'components_components_scores';
  info: {
    displayName: 'TaskScore';
    description: '';
  };
  attributes: {
    score: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    userAnswer: Schema.Attribute.Text;
    defaultScore: Schema.Attribute.Integer;
    heading: Schema.Attribute.String;
    rightAnswer: Schema.Attribute.String;
  };
}

export interface ComponentsLink extends Struct.ComponentSchema {
  collectionName: 'components_components_links';
  info: {
    displayName: 'link';
  };
  attributes: {
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
    isExtarnal: Schema.Attribute.Boolean;
  };
}

export interface ComponentsImage extends Struct.ComponentSchema {
  collectionName: 'components_components_images';
  info: {
    displayName: 'Image';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'layout.olympiad-section': LayoutOlympiadSection;
      'layout.hero-section': LayoutHeroSection;
      'layout.header': LayoutHeader;
      'layout.footer': LayoutFooter;
      'components.score': ComponentsScore;
      'components.link': ComponentsLink;
      'components.image': ComponentsImage;
    }
  }
}
