import { cloudinaryConfig } from "../../util/cloudinary.js";
import Setting from "./setting_model.js";

class SettingController {
  // Add GST
  static addGST = async (req, res) => {
    const { gst } = req.body;
    try {
      if (!gst) {
        return res.status(400).json({
          status: "failed",
          message: "Please Provide Valid GST Value",
        });
      }
      const configuration = await Setting.find();

      if (configuration.length === 0) {
        const createGst = await Setting.create({
          gst,
        });

        if (createGst) {
          return res.status(201).json({
            status: "success",
            message: "GST Created",
          });
        }
      } else {
        const updateGst = await Setting.updateOne(
          {},
          {
            $set: {
              gst,
            },
          }
        );

        if (updateGst) {
          return res.status(200).json({
            status: "success",
            message: "Updated GST Successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add Social Media
  static addSocialMedia = async (req, res) => {
    const { facebook, twitter, instagram, linkedin, mail, youtube, pinterest } =
      req.body;

    try {
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({
          status: "failed",
          message: "Please Provide Social Links",
        });
      }

      const socialMedias = await Setting.findOne();
      console.log(socialMedias.socialMedia);

      if (socialMedias.socialMedia.length === 0) {
        const socialMedia = [
          {
            name: "Facebook",
            link: facebook,
            image:
              "https://res.cloudinary.com/dolqf9s3y/image/upload/v1689230324/social%20media/facebook_ud9ubo.jpg",
          },
          {
            name: "Twitter",
            link: twitter,
            image:
              "https://res.cloudinary.com/dolqf9s3y/image/upload/v1689230323/social%20media/twitter_fjbmza.jpg",
          },
          {
            name: "Instagram",
            link: instagram,
            image:
              "https://res.cloudinary.com/dolqf9s3y/image/upload/v1689230323/social%20media/instagram_xo4yxj.jpg",
          },
          {
            name: "LinkedIn",
            link: linkedin,
            image:
              "https://res.cloudinary.com/dolqf9s3y/image/upload/v1689230323/social%20media/linkedin_w093k8.jpg",
          },
          {
            name: "Mail",
            link: mail,
            image:
              "https://res.cloudinary.com/dolqf9s3y/image/upload/v1689230323/social%20media/mail_bbof51.jpg",
          },
          {
            name: "YouTube",
            link: youtube,
            image:
              "https://res.cloudinary.com/dolqf9s3y/image/upload/v1689230323/social%20media/youtube_lg1jcc.jpg",
          },
          {
            name: "Pinterest",
            link: pinterest,
            image:
              "https://res.cloudinary.com/dolqf9s3y/image/upload/v1689230323/social%20media/pinterest_lyhmur.jpg",
          },
        ];

        if (!socialMedias) {
          await Setting.create({
            socialMedia: socialMedia,
          });
        } else {
          socialMedias.socialMedia = socialMedia;
          await socialMedias.save();
        }
        return res.status(201).json({
          status: "success",
          message: "Added Social Media Links Successfully",
        });

      } else {
        const socialMedia = socialMedias.socialMedia.map((item) => {
          switch (item.name) {
            case "Facebook":
              return { ...item, link: facebook || item.link };
            case "Twitter":
              return { ...item, link: twitter || item.link };
            case "Instagram":
              return { ...item, link: instagram || item.link };
            case "LinkedIn":
              return { ...item, link: linkedin || item.link };
            case "Mail":
              return { ...item, link: mail || item.link };
            case "YouTube":
              return { ...item, link: youtube || item.link };
            case "Pinterest":
              return { ...item, link: pinterest || item.link };
            default:
              return item;
          }
        });
        console.log(socialMedia);

        socialMedias.socialMedia = socialMedia;
        await socialMedias.save();

        if (socialMedia) {
          return res.status(200).json({
            status: "success",
            message: "Updated Social Media Links Successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // add Address

  static addAddress = async (req, res) => {
    const {
      company,
      address,
      city,
      state,
      country,
      pincode,
      website,
      contact,
      email,
    } = req.body;
    console.log(req.body);
    if (
      !company ||
      !address ||
      !city ||
      !state ||
      !country ||
      !pincode ||
      !contact ||
      !email
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Please Provide All Fields",
      });
    }
    try {
      const getAddress = await Setting.find();
      if (getAddress.length === 0) {
        const createAddress = await Setting.create({
          address: {
            company,
            address,
            city,
            state,
            country,
            pincode,
            website,
            contact,
            email,
          },
        });

        if (createAddress) {
          return res.status(201).json({
            status: "success",
            message: "created address successfully",
          });
        }
      } else {
        const updateAddress = await Setting.updateOne(
          {},
          {
            $set: {
              address: {
                company,
                address,
                city,
                state,
                country,
                pincode,
                website,
                contact,
                email,
              },
            },
          }
        );

        if (updateAddress) {
          return res.status(200).json({
            status: "success",
            message: "Updated Address Successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get configuration

  static getSetting = async (req, res) => {
    try {
      const configration = await Setting.find({});
      if (configration) {
        res.status(200).json({
          status: "success",
          result: configration,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "Something went wrong",
      });
    }
  };

  // add logo
  static addLogo = async (req, res) => {
    try {
      const configuration = await Setting.findOne();
      let logo_map = configuration.logo;
      console.log(logo_map);

      if (req.files.Headerlogo) {
        const localpath = req.files.Headerlogo.tempFilePath;
        const result = await cloudinaryConfig(localpath, "image");
        logo_map.Headerlogo = result.url;

      }
      if (req.files.Footerlogo) {
        const localpath = req.files.Footerlogo.tempFilePath;
        const result = await cloudinaryConfig(localpath, "image");

        logo_map.Footerlogo = result.url;

      }
      if (req.files.Adminlogo) {
        const localpath = req.files.Adminlogo.tempFilePath;
        const result = await cloudinaryConfig(localpath, "image");

        logo_map.Adminlogo = result.url;

      }
      if (!configuration) {
        const createLogo = await Setting.create({
          logo: logo_map,
        });

        if (createLogo) {
          return res.status(200).json({
            status: "success",
            data: createLogo,
            message: "Created Logos Successfully",
          });
        }
      } else {

        const updateLogo = await Setting.findOneAndUpdate(
          configuration._id,
          {
            logo: logo_map,
          },
          { new: true }
        );
        if (updateLogo) {
          return res.status(200).json({
            status: "success",
            data: updateLogo,
            message: "Updated Logos Successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //add scrollText
  static addScrollText = async (req, res) => {
    const { scrollText } = req.body;

    try {
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({
          status: "failed",
          message: "Please Provide Scroll Text",
        });
      }

      const config = await Setting.find();
      if (config.length === 0) {
        const createScrollText = await Setting.create(req.body);

        if (createScrollText) {
          return res.status(201).json({
            status: "success",
            message: "Added Scroll Text Successfully",
          });
        }
      } else {
        const updateScroll = await Setting.updateOne(
          {},
          {
            $set: {
              scrollText: scrollText,
            },
          }
        );
        if (updateScroll) {
          return res.status(200).json({
            status: "success",
            message: "Updated Scroll Text Successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //company name
  static addCompanyName = async (req, res) => {
    const { companyName } = req.body;

    try {
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({
          status: "failed",
          message: "Please Provide Scroll Text",
        });
      }

      const config = await Setting.find();
      if (config.length === 0) {
        const createScrollText = await Setting.create(req.body);

        if (createScrollText) {
          return res.status(201).json({
            status: "success",
            message: "Added Scroll Text Successfully",
          });
        }
      } else {
        const updateCompanyName = await Setting.updateOne(
          {},
          {
            $set: {
              companyName: companyName,
            },
          }
        );
        if (updateCompanyName) {
          return res.status(200).json({
            status: "success",
            message: "Updated Scroll Text Successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Application name
  static addApplicationName = async (req, res) => {
    const { appName } = req.body;

    try {
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({
          status: "failed",
          message: "Please Provide Scroll Text",
        });
      }

      const config = await Setting.find();
      if (config.length === 0) {
        const createScrollText = await Setting.create(req.body);

        if (createScrollText) {
          return res.status(201).json({
            status: "success",
            message: "Added Scroll Text Successfully",
          });
        }
      } else {
        const updateAppName = await Setting.updateOne(
          {},
          {
            $set: {
              applicationName: appName,
            },
          }
        );
        if (updateAppName) {
          return res.status(200).json({
            status: "success",
            message: "Updated Scroll Text Successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //About
  static addAbout = async (req, res) => {
    const { about } = req.body;

    try {
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        return res.status(400).json({
          status: "failed",
          message: "Please Provide Scroll Text",
        });
      }

      const config = await Setting.find();
      if (config.length === 0) {
        const createScrollText = await Setting.create({
          aboutCompany: about,
        });
        if (createScrollText) {
          return res.status(201).json({
            status: "success",
            message: "Added Scroll Text Successfully",
          });
        }
      } else {
        const updateabout = await Setting.updateOne(
          {},
          {
            $set: {
              aboutCompany: about,
            },
          }
        );
        if (updateabout) {
          return res.status(200).json({
            status: "success",
            message: "Updated Scroll Text Successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static deleteSetting = async (req, res) => {
    const deleteSetting = await Setting.deleteMany({});
    console.log(deleteSetting);
    if (deleteSetting) {
      return res.status(200).json({
        status: "success",
        message: "Deleted Successfully",
      });
    }
  };
}

export default SettingController;
