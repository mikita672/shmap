package com.mdzvtt.shmap.suggestion;

import com.networknt.schema.Error;
import com.networknt.schema.Schema;
import com.networknt.schema.SchemaLocation;
import com.networknt.schema.SchemaRegistry;
import com.networknt.schema.SpecificationVersion;
import com.networknt.schema.dialect.Dialects;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Component
public class PlaceSuggestionsSchema {
    public static final String NAME = "place_suggestions";
    private static final String LOCATION = "ai/place-suggestions.schema.json";
    private static final String CANDIDATE_ID = "/properties/suggestions/items/properties/candidateId";

    private final ObjectNode schemaNode;
    private final Schema schema;

    public PlaceSuggestionsSchema(JsonMapper jsonMapper) throws IOException {
        try (InputStream in = new ClassPathResource(LOCATION).getInputStream()) {
            schemaNode = (ObjectNode) jsonMapper.readTree(in);
        }
        List<Error> metaErrors = SchemaRegistry.withDialect(Dialects.getDraft202012())
                .getSchema(SchemaLocation.of(Dialects.getDraft202012().getId()))
                .validate(schemaNode);
        if (!metaErrors.isEmpty()) {
            throw new IllegalStateException(LOCATION + " is not a valid JSON Schema: " + metaErrors);
        }
        if (!(schemaNode.at(CANDIDATE_ID) instanceof ObjectNode)) {
            throw new IllegalStateException(LOCATION + " has no " + CANDIDATE_ID);
        }
        schema = SchemaRegistry.withDefaultDialect(SpecificationVersion.DRAFT_2020_12).getSchema(schemaNode);
        schema.initializeValidators();
    }

    public List<String> validate(JsonNode reply) {
        return schema.validate(reply).stream()
                .map(Error::toString)
                .toList();
    }

    public ObjectNode requestCopy(List<String> candidateIds) {
        ObjectNode copy = schemaNode.deepCopy();
        copy.remove("$schema");
        ArrayNode allowedIds = ((ObjectNode) copy.at(CANDIDATE_ID)).putArray("enum");
        candidateIds.forEach(allowedIds::add);
        return copy;
    }
}
