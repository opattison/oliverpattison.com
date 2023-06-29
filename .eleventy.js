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
  const luxon = require("luxon");
  const yaml = require("js-yaml");
  const cleancss = require("clean-css");
  const imgix = require("@imgix/js-core");
  
  eleventyConfig.addShortcode("markdown", (content) => {
    return markdown.render(content);
  });
  
  eleventyConfig.addFilter("toISODate", (date) => {
    return luxon.DateTime.fromISO(date).toISODate();
  });

  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
  
  eleventyConfig.addFilter("cssmin", function(code) {
    return new cleancss({}).minify(code).styles;
  });
  
  const token = process.env.IMGIX_OP;
  const client = new imgix({
    domain: 'oliverpattison.imgix.net',
    secureURLToken: token
  });
  const basePath = "/images/";
    
  eleventyConfig.addShortcode("image_flex", (path, alt, style) => { 
    const defaultWidth = 501;
    const defaultHeight = 334;
    const srcDev = basePath + path;
    
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
    
    const sizes = "(min-width: 35em) calc(50vw - 3em), (min-width: 28em) calc(50vw - 2em), calc(100vw - 4em)";
    
    if (process.env.NODE_ENV === 'development') {
      return `<img src="${srcDev}" alt="${alt}" class="image ${style}">`;
    }
    else {
      return `<img src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${alt}" width="${defaultWidth}" height="${defaultHeight}" class="image ${style}">`;
    };
  });
  
  eleventyConfig.addShortcode("image_full", (path, alt) => {
    const defaultWidth = 1026;
    const defaultHeight = 684;
    const srcDev = basePath + path;
    
    const src = client.buildURL(path, 
      {
        w: defaultWidth,
        h: defaultHeight
      }
    );
    
    const srcset = client.buildSrcSet(path,
      {},
      { widths: [699, 900, 1026, 1101, 1299, 1500, 2052] }
    );
    
    const sizes = "calc(100vw - 2em)";
        
    if (process.env.NODE_ENV === 'development') {
      return `<img src="${srcDev}" alt="${alt}" class="image">`;
    }
    else {
      return `<img src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${alt}" width="${defaultWidth}" height="${defaultHeight}" class="image">`;
    };
  });
  
  eleventyConfig.addShortcode("image_og", (path) => {
    const src = client.buildURL(path, {
      w: 1200,
      h: 630,
      fit: 'crop',
      crop: 'faces'
    });
    
    return `${src}`;
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