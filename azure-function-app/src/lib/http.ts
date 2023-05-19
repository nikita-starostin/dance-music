import {app, HttpFunctionOptions, HttpRequest, HttpResponse} from "@azure/functions";
import {parse} from "parse-multipart-data";

/**
 *
 * @param request with body that contains multipart formData
 * @description
 * sample data:
 * boundary=
 * file[0]: HTML Input File
 * title[0]: some string
 * danceType[0]: Waltz
 * tags[0]: ['Ru']
 * artist[0]: 'John Doe'
 * boundary=
 * file[1]: HTML Input File
 * title[1]: Ch31 Korotkoff -orig. Little Big--UNO-kissvk.com.mp3
 * danceType[1]: Waltz
 * tags[1]: ['Ru']
 * artist[1]: 'John Doe'
 *
 * will be parsed into array of objects:
 * [
 *    {
 *       file: {
 *         filename: 'Ch31 Korotkoff -orig. Little Big--UNO-kissvk.com.mp3',
 *         type: 'audio/mpeg',
 *         data: Buffer
 *       },
 *       title: 'Ch31 Korotkoff -orig. Little Big--UNO-kissvk.com.mp3',
 *       danceType: 'Waltz',
 *       tags: ['Ru'],
 *       artist: 'John Doe'
 *    },
 *    {
 *       file: {
 *         filename: 'Ch31 Korotkoff -orig. Little Big--UNO-kissvk.com.mp3',
 *         type: 'audio/mpeg',
 *         data: Buffer
 *       },
 *       title: 'Ch31 Korotkoff -orig. Little Big--UNO-kissvk.com.mp3',
 *       danceType: 'Waltz',
 *       tags: ['Ru'],
 *       artist: 'John Doe'
 *    }
 * ]
 */
export async function parseMultipartDataArray<TModel>(request: HttpRequest): Promise<TModel[]> {
    const body = Buffer.from(await request.arrayBuffer());
    const boundary = request.headers.get('content-type').split('boundary=')[1];
    const parts = parse(body, boundary);
    const items: Array<TModel> = [];
    for (let i = 0; i < parts.length; ++i) {
        const index = parts[i].name.split('[')[1].split(']')[0];

        if (!items[index]) {
            items[index] = {}
        }

        if (parts[i].filename) {
            items[index].file = {
                filename: parts[i].filename,
                type: parts[i].type,
                data: parts[i].data
            }
        } else {
            items[index][parts[i].name.split('[')[0]] = parts[i].data.toString();
        }
    }
    return items;
}

export const OkResult: HttpResponse = {
    status: 200
}

export function createFunction(name: string, options: HttpFunctionOptions) {
    app.http(name, {
        ...options,
        handler: async (context, request) => {
            try {
                return await options.handler(context, request);
            } catch (e) {
                context.log(e);
                return {
                    status: 500,
                }
            }
        }
    })
}
