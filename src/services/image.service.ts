import Container, { Service, Inject } from 'typedi';
import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { Logger } from 'winston';
import { GenericError } from '@src/utils/CustomError';

@Service()
export default class ImageService {
  logger: Logger;

  constructor() {
    this.logger = Container.get('logger') as Logger;
  }

  public async upload(path: string): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(path));
      formData.append('type', 'file');
      const config: AxiosRequestConfig = {
        method: 'POST',
        url: 'https://api.imgur.com/3/upload',
        headers: {
          ...formData.getHeaders(),
        },
        data: formData,
      };

      const response = await axios(config);
      const result = response.data.data.link;

      fs.unlinkSync(path);

      return { url: result };
    } catch (err) {
      throw new GenericError('uploadImage');
    }
  }
}
