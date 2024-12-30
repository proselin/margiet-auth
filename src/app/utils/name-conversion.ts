import slugify from 'slugify';

export class NameConversion {
  /**
   * Format Name
   *
   * Takes a string trims it and capitalizes every word
   */
  public static formatName(title: string): string {
    return title
      .trim()
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
  }

  /**
   * Generate Point Slug
   *
   * Takes a string and generates a slug with dtos as word separators
   */
  public static generatePointSlug(str: string): string {
    return slugify(str, { lower: true, replacement: '.', remove: /['_.-]/g });
  }
}
