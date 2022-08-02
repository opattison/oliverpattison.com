module.exports = function(eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    "md",
    "jpg",
    "png",
    "gif",
    "svg",
    "webp",
    "woff",
    "woff2",
    "toml",
    "webmanifest"
  ]);
  
  const markdown = require("markdown-it")({
    html: true
  });
  const yaml = require("js-yaml");
  const cleancss = require("clean-css");
  const imgix = require("@imgix/js-core");
  
  eleventyConfig.addShortcode("markdown", (content) => {
    return markdown.render(content);
  });
    
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
  
  eleventyConfig.addFilter("cssmin", function(code) {
    return new cleancss({}).minify(code).styles;
  });
  
  eleventyConfig.addShortcode("image_portfolio", (path, alt) => {
    const token = process.env.IMGIX_OP;
    const client = new imgix({
      domain: 'oliverpattison.imgix.net',
      secureURLToken: token
    });
    
    const defaultWidth = 501;
    const defaultHeight = 334;
    
    const src = client.buildURL(path, 
      {
        w: defaultWidth,
        h: defaultHeight
      }
    );
    
    const srcset = client.buildSrcSet(path,
      {},
      { widths: [300, 501, 699, 900, 1101, 1299, 1500] }
    );
    
    const sizes = "84vw, (min-width: 52em) 42vw";
    
    return `<img src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${alt}" width="${defaultWidth}" height="${defaultHeight}" class="grid-image">`;
  });
  
  eleventyConfig.addShortcode("image_profile", (path, alt) => {
    const token = process.env.IMGIX_OP;
    const client = new imgix({
      domain: 'oliverpattison.imgix.net',
      secureURLToken: token
    });
    
    const defaultWidth = 501;
    const defaultHeight = 334;
    
    const src = client.buildURL(path, 
      {
        w: defaultWidth,
        h: defaultHeight
      }
    );
    
    const srcset = client.buildSrcSet(path,
      {},
      { widths: [300, 501, 699, 900, 1101, 1299, 1500] }
    );
    
    const sizes = "92vw, (min-width: 35em) 45vw";
    
    return `<img src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${alt}" width="${defaultWidth}" height="${defaultHeight}" class="profile">`;
  });
  
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    
    dir: {
      data: "_data",
      layouts: "_layouts",
      includes: "_includes",
      input: "input",
      output: "output"
    }
  }
};