import {
	appendErrors,
	Resolver,
	ResolverError,
	ResolverSuccess,
	transformToNestObject,
} from 'react-hook-form';
import * as z from 'zod';
import { ParseParams } from 'zod/lib/cjs/parser';

const convertArrayToPathName = (paths: (string | number)[]): string =>
	paths
		.reduce(
			(previous, path: string | number, index): string =>
				`${previous}${
					typeof path === 'string'
						? `${index > 0 ? '.' : ''}${path}`
						: `[${path}]`
				}`,
			'',
		)
		.toString();

const parseErrorSchema = (
	zodError: z.ZodError,
	validateAllFieldCriteria: boolean,
) => {
	if (zodError.isEmpty) {
		return {};
	}

	return zodError.errors.reduce<Record<string, any>>(
		(previous, { path, message, code: type }) => {
			const currentPath = convertArrayToPathName(path);

			return {
				...previous,
				...(path
					? previous[currentPath] && validateAllFieldCriteria
						? {
								[currentPath]: appendErrors(
									currentPath,
									validateAllFieldCriteria,
									previous,
									type,
									message,
								),
						  }
						: {
								[currentPath]: previous[currentPath] || {
									message,
									type,
									...(validateAllFieldCriteria
										? {
												types: { [type]: message || true },
										  }
										: {}),
								},
						  }
					: {}),
			};
		},
		{},
	);
};

export const zodResolver =
	<T extends z.ZodSchema<any, any>>(
		schema: T,
		options?: ParseParams,
	): Resolver<z.infer<T>> =>
	async (values, _, validateAllFieldCriteria = false) => {
		return schema.safeParseAsync(values, options).then((result) => {
			if (result.success) {
				return { values: result.data, errors: {} } as ResolverSuccess<
					z.infer<T>
				>;
			}

			return {
				values: {},
				errors: transformToNestObject(
					parseErrorSchema(result.error, validateAllFieldCriteria),
				),
			} as ResolverError<z.infer<T>>;
		});
	};
